<?php

namespace App\Repositories;

abstract class BaseRepository
{
    protected $query;
    abstract public function index();
    abstract public function show($id);
    abstract public function store($data);
    abstract public function update($data, $id);
    abstract public function delete($id);
}
