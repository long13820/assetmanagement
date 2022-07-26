<?php

namespace App\Services;

abstract class BaseService
{
    protected $query;
    abstract public function index();
    abstract public function show($id);
    abstract public function store($data);
    abstract public function update($data, $id);
    abstract public function delete($id);
}
